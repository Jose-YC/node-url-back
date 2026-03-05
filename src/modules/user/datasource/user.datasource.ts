import {
  CreateUserDtos,
  UpdatePasswordDtos,
  UpdateProfileDtos,
  UpdateUserDtos,
  User,
  Users,
  UserPermissions,
  UserPaginateDtos,
} from "../dto";
import { bcryptjsAdapter, List, CustomError } from "../../../shared";
import { prisma } from "../../../config";

interface UserSP {
  id: number;
  name: string;
  email: string;
}

interface RolSP {
    id:number
    name:string
}

interface UserByIdSP extends UserSP {
    roles: RolSP[]
}

interface UserPermissionsByIdSP extends UserSP {
    permission: string[]
}


export class UserDatasource {
  async create(createUser: CreateUserDtos): Promise<Boolean> {
    const password = bcryptjsAdapter.hash(createUser.password);
    const roles = `{${createUser.rol.join(',')}}`;

    const user = await prisma.$queryRaw`
            CALL sp_CreateUser(
            p_user_name := ${createUser.name}::VARCHAR,
            p_user_email := ${createUser.email}::VARCHAR,
            p_user_password := ${password}::VARCHAR,
            p_roles_ids := ${roles}::INTEGER[]
    );`;
    
    return !!user;
  }

  async get(paginate: UserPaginateDtos): Promise<List<Users>> {
    const [count, users] = await Promise.all([
       await prisma.$queryRaw<{ fc_countlistusers: number }[]>`
          SELECT * FROM fc_CountListUsers(
          p_search := ${paginate.search}::TEXT
      );`,

      await prisma.$queryRaw<UserSP[]>`SELECT * FROM fc_ListUsers(
          p_page := ${paginate.page}::INTEGER,
          p_limit := ${paginate.lim}::INTEGER,
          p_search := ${paginate.search}::TEXT
      );`
    ]);

    return { 
      total: count[0].fc_countlistusers, 
      items: users.map((user) => Users.fromObject(user)) 
    };
  }

  async getId(id: number): Promise<User> {
    const [ user ] = await prisma.$queryRaw<UserByIdSP[]>`
        SELECT * FROM fc_UserById(
        p_user_id := ${id}::integer
    );`;

    if (!user) throw CustomError.badRequest('User not found');

    return User.fromObject(user);
  }

  async getPermissions(id: number): Promise<UserPermissions> {
    const [ user ] = await prisma.$queryRaw<UserPermissionsByIdSP[]>`
        SELECT * FROM fc_UserPermissionsById(
        p_user_id := ${id}::integer
    );`;

    if (!user) throw CustomError.badRequest('User not found');

    return UserPermissions.fromObject(user);
  }

  async update(updateUser: UpdateUserDtos): Promise<Boolean> {
    await this.getId(updateUser.id);

    const update = { ...updateUser };

    if (update.password) {
      const password = bcryptjsAdapter.hash(update.password);
      update.password = password;
    }

    const roles = update.rol ?`{${update.rol.join(',')}}` : null;

    const user = await prisma.$queryRaw`
            CALL sp_UpdateUser(
            p_user_id := ${updateUser.id}::INTEGER,
            p_user_name := ${update.name}::VARCHAR,
            p_user_email := ${update.email}::VARCHAR,
            p_user_password := ${update.password}::VARCHAR,
            p_roles_ids := ${roles}::INTEGER[]
    );`;

    console.log({user});

    return !!user;
  }
  
  async profile(updateProfile: UpdateProfileDtos): Promise<Boolean> {
    await this.getId(updateProfile.id);
    const user = await prisma.user.update({
      where: { id: updateProfile.id, deleted_at: null },
      data: updateProfile!.values,
    });
    return !!user;
  }

  async password(updatePassword: UpdatePasswordDtos): Promise<Boolean> {
    const exists = await prisma.user.findFirst({
      where: { id: updatePassword.id, deleted_at: null },
    });
    if (!exists) throw CustomError.badRequest("This user does not exist");

    const valid = bcryptjsAdapter.compare(
      exists.password,
      updatePassword.oldPassword
    );
    if (!valid) throw CustomError.badRequest("Incorrect password");

    const password = bcryptjsAdapter.hash(updatePassword.password);

    const user = await prisma.user.update({
      where: { id: updatePassword.id, deleted_at: null },
      data: { password },
    });
    return !!user;
  }
  
  async delete(id: number): Promise<Boolean> {
    await this.getId(id);
    const user = await prisma.user.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return !!user;
  }
}
