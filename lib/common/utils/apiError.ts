

export class ApiError extends Error  {
    public status : number;
    private success: boolean;
    public code: string

    constructor(success: boolean, name: string, status: number, message: string, code?:string) {
        super(message);
        // Object.setPrototypeOf(this, ApiError.prototype);
        this.success = success;
        this.name = name;
        this.status = status;
        this.code = code;
    }
}
