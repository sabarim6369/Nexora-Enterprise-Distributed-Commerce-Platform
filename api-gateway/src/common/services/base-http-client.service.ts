import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError, map } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class BaseHttpClient {
  constructor(private readonly httpService: HttpService) {}

  async get<T>(url: string, config?: any): Promise<T> {
    return firstValueFrom(
      this.httpService.get<T>(url, config).pipe(
        map((response) => response.data),
        catchError((error: AxiosError) => {
          throw this.handleError(error);
        }),
      ),
    );
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    return firstValueFrom(
      this.httpService.post<T>(url, data, config).pipe(
        map((response) => response.data),
        catchError((error: AxiosError) => {
          throw this.handleError(error);
        }),
      ),
    );
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    return firstValueFrom(
      this.httpService.put<T>(url, data, config).pipe(
        map((response) => response.data),
        catchError((error: AxiosError) => {
          throw this.handleError(error);
        }),
      ),
    );
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    return firstValueFrom(
      this.httpService.patch<T>(url, data, config).pipe(
        map((response) => response.data),
        catchError((error: AxiosError) => {
          throw this.handleError(error);
        }),
      ),
    );
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    return firstValueFrom(
      this.httpService.delete<T>(url, config).pipe(
        map((response) => response.data),
        catchError((error: AxiosError) => {
          throw this.handleError(error);
        }),
      ),
    );
  }

  private handleError(error: AxiosError): HttpException {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const responseData = error.response.data as any;
      const message = responseData?.message || error.message || 'Service error';
      
      return new HttpException(
        {
          statusCode: status,
          message,
          service: error.config?.url,
        },
        status,
      );
    } else if (error.request) {
      // The request was made but no response was received
      return new HttpException(
        {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'Service unavailable - no response received',
          service: error.config?.url,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      return new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
