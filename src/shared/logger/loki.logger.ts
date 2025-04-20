import { ConsoleLogger, Injectable } from '@nestjs/common';
import axios from 'axios';
import { LOKI_URL } from '../config/logging';

@Injectable()
export class LokiLogger extends ConsoleLogger {
  private defaultLabels: any = {
    app: process.env.APP_NAME || 'not-set',
    env: process.env.NODE_ENV || 'development',
  };

  private sendLokiRequest = (
    labels: Record<string, string>,
    message: string,
  ): any => {
    const data = JSON.stringify({
      streams: [
        {
          stream: labels,
          values: [[(Date.now() * 1000000).toString(), message]],
        },
      ],
    });

    axios({
      method: 'POST',
      url: `${LOKI_URL}/loki/api/v1/push`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    })
      .then()
      .catch((error) => {
        console.error('error', error.message, error?.response?.data);
      });
  };

  error(
    message: string,
    trace?: string,
    context?: string,
    labels?: Record<string, string>,
  ): void {
    this.sendLokiRequest(
      {
        ...this.defaultLabels,
        ...labels,
        context: context ?? this.context,
        level: 'error',
      },
      message,
    );

    super.error(message, trace, context);
  }

  log(
    message: string,
    context?: string,
    labels?: Record<string, string>,
  ): void {
    this.sendLokiRequest(
      {
        ...this.defaultLabels,
        ...labels,
        context: context ?? this.context,
        level: 'info',
      },
      message,
    );

    super.log(message, context);
  }

  warn(
    message: string,
    context?: string,
    labels?: Record<string, string>,
  ): void {
    this.sendLokiRequest(
      {
        ...this.defaultLabels,
        ...labels,
        context: this.context,
        level: 'warn',
      },
      message,
    );

    super.warn(message, context);
  }

  debug(
    message: string,
    context?: string,
    labels?: Record<string, string>,
  ): void {
    this.sendLokiRequest(
      {
        ...this.defaultLabels,
        ...labels,
        context: this.context,
        level: 'debug',
      },
      message,
    );

    super.debug(message, context);
  }

  verbose(
    message: string,
    context?: string,
    labels?: Record<string, string>,
  ): void {
    this.sendLokiRequest(
      {
        ...this.defaultLabels,
        ...labels,
        context: this.context,
        level: 'verbose',
      },
      message,
    );

    super.verbose(message, context);
  }
}
