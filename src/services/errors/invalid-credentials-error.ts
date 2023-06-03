export class InvalidCredentialsError extends Error {
	constructor(){
		super('Incorrect email or password.')
	}
}