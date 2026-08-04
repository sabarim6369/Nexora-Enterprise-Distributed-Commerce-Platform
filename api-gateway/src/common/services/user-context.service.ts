import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class UserContextService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  getUser() {
    return this.request.user as {
      userId: string;
      email: string;
      role: string;
      firstName?: string;
      lastName?: string;
    } | null;
  }

  getUserId(): string | null {
    const user = this.getUser();
    return user?.userId || null;
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user?.role || null;
  }

  getUserEmail(): string | null {
    const user = this.getUser();
    return user?.email || null;
  }

  isAuthenticated(): boolean {
    return this.getUser() !== null;
  }

  hasRole(role: string): boolean {
    return this.getUserRole() === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }
}
