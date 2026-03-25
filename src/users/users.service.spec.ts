import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from "./users.service"


describe("user service", () => {

    let userService: UsersService

    beforeEach(async () => {

        const app: TestingModule = await Test.createTestingModule({
            providers: [UsersService]
        }).compile()


        userService = app.get<UsersService>(UsersService)
    })



})