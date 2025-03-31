export class StandardResponse<T> {
  statusCode: number
  Result: T | null

  constructor(statusCode: number, data: T | null = null) {
    this.statusCode = statusCode
    this.Result = data
  }
}
