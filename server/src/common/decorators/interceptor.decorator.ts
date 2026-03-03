import { SetMetadata, applyDecorators, Injectable } from '@nestjs/common';

// Unique Metadata Keys
export const INTERCEPTOR_METADATA_KEY = 'is_custom_interceptor';

// Custom @Interceptor decorator
export const Interceptor = () => 
  applyDecorators(
    Injectable(),
    SetMetadata(INTERCEPTOR_METADATA_KEY, true)
  );

