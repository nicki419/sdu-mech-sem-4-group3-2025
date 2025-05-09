export class SerialManager {
    private port: SerialPort | null = null;
    private writer: WritableStreamDefaultWriter | null = null;
    private reader: ReadableStreamDefaultReader | null = null;
    private onReceiveCallback?: (data: string) => void;
    private incomingBuffer: string[] = [];

    private decoder?: TextDecoderStream;
    private encoder?: TextEncoderStream;
    private inputDone?: Promise<void>;
    private outputDone?: Promise<void>;

    private connectionListeners: ((connected: boolean) => void)[] = [];

    async connect(): Promise<void> {
        this.port = await navigator.serial.requestPort();
        await this.port.open({ baudRate: 115200 });

        this.decoder = new TextDecoderStream();
        this.inputDone = this.port.readable!.pipeTo(this.decoder.writable);
        this.reader = this.decoder.readable.getReader();

        this.readLoop();

        this.encoder = new TextEncoderStream();
        this.outputDone = this.encoder.readable.pipeTo(this.port.writable!);
        this.writer = this.encoder.writable.getWriter();

        const success = await this.verifyConnection();
        if (!success) throw new Error('Connection verification failed.');
    }

    async disconnect(): Promise<void> {
        try {
            if (this.reader) {
                await this.reader.cancel();
                this.reader.releaseLock();
            }

            if (this.writer) {
                await this.writer.close();
                this.writer.releaseLock();
            }

            // Wait for streams to finish piping
            await this.inputDone?.catch(() => {});
            await this.outputDone?.catch(() => {});

            if (this.port) {
                await this.port.close();
            }
        } catch (err) {
            console.error("Error during serial disconnect:", err);
        } finally {
            this.port = null;
            this.reader = null;
            this.writer = null;
            this.decoder = undefined;
            this.encoder = undefined;
            this.inputDone = undefined;
            this.outputDone = undefined;
            this.incomingBuffer = [];
        }
    }

    async send(text: string): Promise<void> {
        if (this.writer) {
            await this.writer.write(text + '\n');
        } else {
            throw new Error("Serial port is not connected.");
        }
    }

    onReceive(callback: (data: string) => void) {
        this.onReceiveCallback = callback;
    }

    get connected(): boolean {
        return !!this.port && this.port.readable !== null && this.port.writable !== null;
    }

    private async verifyConnection(): Promise<boolean> {
        for (let attempt = 0; attempt < 5; attempt++) {
            this.incomingBuffer = [];
            await this.send('conn');

            const result = await this.waitForResponse('conn', 300); // wait 300ms
            if (result) return true;
        }
        return false;
    }

    onConnectionChange(callback: (connected: boolean) => void) {
        this.connectionListeners.push(callback);
    }

    private notifyConnectionChange() {
        for (const cb of this.connectionListeners) {
            cb(this.connected);
        }
    }

    private async waitForResponse(expected: string, timeout: number): Promise<boolean> {
        return new Promise((resolve) => {
            const timer = setTimeout(() => resolve(false), timeout);
            const check = () => {
                if (this.incomingBuffer.includes(expected)) {
                    clearTimeout(timer);
                    resolve(true);
                } else {
                    requestAnimationFrame(check);
                }
            };
            check();
        });
    }

    private async readLoop() {
        while (this.reader) {
            const { value, done } = await this.reader.read();
            if (done) break;
            if (value) {
                const lines: string[] = value
                    .split(/\r?\n/)
                    .map((line: string) => line.trim())
                    .filter((line: string) => Boolean(line));
                this.incomingBuffer.push(...lines);
                lines.forEach((line: string) => this.onReceiveCallback?.(line));
            }
        }
    }
}
