import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Protects admin-only routes. Attach with @UseGuards(JwtAuthGuard)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
