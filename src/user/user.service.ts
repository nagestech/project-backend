import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createuser.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
          private userRepository:Repository<User>
    ) {}
    async getAllUser(){
      const users=this.userRepository.find();
      return users;
    }
    async findOne(username){
      return this.userRepository.findOne({where:{username}})
    }
    async getUser(id){
      const user=this.userRepository.findOne({
        where:{
            userid:id,      
        },
      });
      if(user) {
        return user;
      }
      throw new NotFoundException('could not found user')
    }
    async addUser(createUserDto:CreateUserDto){
      const salt= await bcrypt.genSalt();
      const password=await bcrypt.hash(createUserDto.password,salt);
      return this.userRepository.save({
        ...createUserDto,
        password
      });
    }
    async deleteuser(id) {
        const user = await this.userRepository.findOne({
          where: {userid: id},
        });
        if (!user) {
          return null;
        }
        await this.userRepository.remove(user);
        return user;
      }
       async update(userid: number, user: Partial<User>): Promise<User> {
        await this.userRepository.update(userid, user);
        return this.userRepository.findOne({ where: { userid } });
      }
       
}