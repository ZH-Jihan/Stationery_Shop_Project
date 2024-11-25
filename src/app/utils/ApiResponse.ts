class ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data?: any;

  constructor(statusCode: number, data: any, massage: string, success = true) {
    this.statusCode = statusCode;
    this.message = massage;
    this.success = success;
    this.data = data;
  }
}

export default ApiResponse;
