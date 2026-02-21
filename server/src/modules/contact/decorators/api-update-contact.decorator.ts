import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateContactDto } from '../dto/create-contact.dto';
import { UpdateContactDto } from '../dto/update-contact.dto';
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
        schema: {   
            examples: {  
                example1: {
                    summary: 'Example Contact',
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
    }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found.' }),
    ...BearerAuthResponses
  );
}

export function ApiUpdateContact() {
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
        schema: {   
            examples: {  
                example1: {
                    summary: 'Updated Contact',
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
    }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found.' }),
    ...BearerAuthResponses
  );
}

export function ApiDeleteContact() {
  return applyDecorators(
    ApiOperation({ 
        summary: 'Hard delete contact',
        description: 'Deletes a specific contact by ID.'
    }),
    ApiParam({ name: 'id', type: Number }),
    ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Deleted.' }),
    ...BearerAuthResponses
  );
}
