export type ErrorResponseProps = {
	message: string;
	errors: Record<string, string[]>;
};

export class ErrorResponse extends Error {
	errors: Record<string, string[]>;

	constructor({ message, errors }: ErrorResponseProps) {
		super(message);
		this.errors = errors;
	}
}
