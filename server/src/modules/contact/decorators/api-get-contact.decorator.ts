import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Contact } from '../entities/contact.entity';
import { BearerAuthResponses } from '../../../common/decorators/bearer-auth-responses.decorator';

export function ApiGetContact() {
  return applyDecorators(
    ApiOperation({ 
        summary: 'Retrieve a specific contact',
        description: 'Retrieves the details of a specific contact by ID.'
    }),
    ApiParam({ name: 'id', type: Number }),
    ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Found.', 
        type: Contact,     
        example: {
            summary: 'Created Contact',
            value: {
                id: 1,
                userId: 1,
                fullName: 'Jane Smith',
                phone: '(123) 456-7890',
                email: 'jane.smith@example.com',
                fax: '(123) 456-7890',
                location: {       
                    address: '456 Elm St',
                    city: 'Othertown',
                    state: 'NY',
                    zipcode: '67890',
                    country: 'US'
                }
            }
        }
 
    }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found.' }),
    ...BearerAuthResponses
  );
}
