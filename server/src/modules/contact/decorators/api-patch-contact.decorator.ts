import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UpdateContactDto } from '../dto/update-contact.dto';
import { Contact } from '../entities/contact.entity';
import { BearerAuthResponses } from '../../../common/decorators/bearer-auth-responses.decorator';

export function ApiPatchContact() {
  return applyDecorators(
    ApiOperation({ 
        summary: 'Update contact details',
        description: 'Updates the details of a specific contact by ID.'
    }),
    ApiParam({ name: 'id', type: Number }),
    ApiBody({ 
        type: UpdateContactDto,
        examples: {
          example1: {
            summary: 'Standard Contact Update',
            value: {
                fullName: 'Jane Smith',
                phone: '+15559876543',
                email: 'jane.smith@example.com',
                fax: '+1-555-333-4444',
                location: {       
                    address: '456 Elm St',
                    city: 'Othertown',
                    state: 'NY',
                    zipcode: '67890',
                    country: 'US'
                }
            }
          }
        }
     }), // Use UpdateContactDto for partial updates
    ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Updated.', 
        type: Contact,
        example: {
            summary: 'Updated Contact',
            value: {
                id: 1,
                userId: 1,
                fullName: 'Jane Smith',
                phone: '+15559876543',
                email: 'jane.smith@example.com',
                fax: '+1-555-333-4444',
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
