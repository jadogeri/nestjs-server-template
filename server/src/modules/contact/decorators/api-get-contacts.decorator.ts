import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Contact } from '../entities/contact.entity';
import { BearerAuthResponses } from 'src/common/decorators/bearer-auth-responses.decorator';


export function ApiGetContacts() {
  return applyDecorators(
    ApiOperation({ 
        summary: 'Retrieve all contacts',
        description: 'Retrieves a list of all contacts.'
    }),
    ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Successfully retrieved contacts.', 
        type: [Contact] ,
        schema: {   
            examples: [  
                {
                    summary: 'Example Contact List',
                    value: [    
                        {
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
                        },
                        {
                            id: 2,
                            fullName: 'John Doe',
                            phone: '+15551234567',
                            email: 'john.doe@example.com',
                            fax: '+1-555-444-5555',
                            location: {       
                                address: '789 Oak St',
                                city: 'Sometown',
                                state: 'CA',
                                zipcode: '54321',
                                country: 'US'
                            }
                        }
                    ]
                },

            ]
        }   
    }), // Array type
    ...BearerAuthResponses
  );
}
