import { Controller, Get, UseGuards, Request, Post, Body, Query, Req, HttpException, HttpStatus, Delete, Put } from '@nestjs/common';
import { Action } from '../../shared/casl/action.enum';
import { AppAbility, CaslAbilityFactory } from '../../shared/casl/casl-ability.factory';
import { CheckPolicies } from '../../shared/casl/policy.decorator';
import { PoliciesGuard, PoliciesGuardEx } from '../../shared/casl/policy.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../../shared/entities/user.entity';
import { UserDto } from '../../shared/dto/user.dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryDto } from '../../shared/dto/query.dto';
import { UserUpdateDto } from '../../shared/dto/user.update.dto';
import { PasswordUpdateDto } from '../../shared/dto/password.update.dto';
import { Role } from '../../shared/casl/role.enum';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService, private caslAbilityFactory: CaslAbilityFactory) {}
    
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
      const u = await this.userService.findOne(req.user.username);
      if (u) {
        delete u.password; 
      }
      return u;
    }
    
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @CheckPolicies((ability, body) => ability.can(Action.Create, Object.assign(new User(), body)))
    @Post('add')
    addUser(@Body()user: UserDto) {
      if (user.role == Role.Root) {
        throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED)
      }
      return this.userService.create(user)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PoliciesGuardEx(false, Action.Update, User))
    // @CheckPolicies((ability, body) => ability.can(Action.Update, Object.assign(new User(), body)))
    @Put('update')
    updateUser(@Body()user: UserUpdateDto) {
      return this.userService.update(user)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PoliciesGuardEx(false, Action.Update, User))
    // @CheckPolicies((ability, body) => ability.can(Action.Update, Object.assign(new User(), body)))
    @Put('resetPassword')
    resetPassword(@Body()reset: PasswordUpdateDto, @Request() req) {
      return this.userService.resetPassword(req.user.id, reset)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, User))
    @Get('query')
    queryUser(@Query()query: QueryDto, @Request() req) {
      return this.userService.query(query, req.abilityCondition)
    }
    
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Delete, User))
    @Delete('delete')
    deleteUser(@Query() email: string, @Request() req) {
      return this.userService.delete(email, req.abilityCondition)
    }
}
