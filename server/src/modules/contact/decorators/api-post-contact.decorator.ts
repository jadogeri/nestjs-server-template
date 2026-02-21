import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateContactDto } from '../dto/create-contact.dto';
import { Contact } from '../entities/contact.entity';
import { BearerAuthResponses } from 'src/common/decorators/bearer-auth-responses.decorator';

export function ApiPostContact() {
  return applyDecorators(
    ApiOperation({ 
        summary: 'Create a new contact',
        description: 'Creates a new contact with the provided details. All fields are optional except fullName, which is required.'
    }),
    ApiBody({ 
        type: CreateContactDto,
        examples: {
          example1: {
            summary: 'Standard Contact Creation',  
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
    }), // Explicitly set request body type
    ApiResponse({ 
        status: HttpStatus.CREATED, 
        description: 'Contact created successfully.', 
        type: Contact,
        schema: {   
            examples: {  
                example1: {
                    summary: 'Created Contact',
                    value: {
                        id: 1,
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
        }   
    }), // Return type
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' }),
    ...BearerAuthResponses
  );
}
