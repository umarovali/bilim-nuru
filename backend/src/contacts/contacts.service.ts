import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactsService {
  constructor(@InjectModel(Contact.name) private model: Model<ContactDocument>) {}

  // Public: save a new request from the "Contacts" form
  create(dto: CreateContactDto) {
    return this.model.create(dto);
  }

  // Admin: list all requests, newest first
  findAll() {
    return this.model.find().sort({ createdAt: -1 });
  }

  async markRead(id: string) {
    const contact = await this.model.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!contact) throw new NotFoundException('Заявка не найдена');
    return contact;
  }

  async remove(id: string) {
    const result = await this.model.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Заявка не найдена');
    return { deleted: true };
  }
}
