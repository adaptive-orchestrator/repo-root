import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Customer } from './customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

@Injectable()
export class CustomerSvcService {
  constructor(
    @InjectRepository(Customer)
    private readonly repo: Repository<Customer>,

    @Inject('KAFKA_SERVICE')
    private readonly kafka: ClientKafka,
  ) {}

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const customer = await this.repo.save(this.repo.create(dto));

    // 👇 Emit event customer.created
    this.kafka.emit('customer.created', {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      createdAt: customer.createdAt,
    });

    return customer;
  }

  async findAll(): Promise<Customer[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.repo.findOne({ where: { id } });
    if (!customer) throw new NotFoundException(`Customer ${id} not found`);
    return customer;
  }

  async update(id: number, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    Object.assign(customer, dto);
    return this.repo.save(customer);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async updateSegment(id: number, segment: string): Promise<Customer> {
    const customer = await this.findOne(id);
    customer.segment = segment;
    const saved = await this.repo.save(customer);

    // 👇 Emit event segment.changed
    this.kafka.emit('segment.changed', {
      customerId: saved.id,
      segment: saved.segment,
    });

    return saved;
  }
}
