import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const ByPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
