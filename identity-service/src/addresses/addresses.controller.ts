import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  async create(@Body() createAddressDto: CreateAddressDto, @Request() req) {
    return this.addressesService.create(req.user.userId, createAddressDto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.addressesService.findAll(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.addressesService.findOne(id, req.user.userId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto, @Request() req) {
    return this.addressesService.update(id, req.user.userId, updateAddressDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req) {
    return this.addressesService.remove(id, req.user.userId);
  }

  @Put(':id/default')
  async setDefault(@Param('id') id: string, @Request() req) {
    return this.addressesService.setDefault(id, req.user.userId);
  }
}
