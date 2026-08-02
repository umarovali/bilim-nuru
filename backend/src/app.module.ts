import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { BlogsModule } from './blogs/blogs.module';
import { TeachersModule } from './teachers/teachers.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ContactsModule } from './contacts/contacts.module';
import { BranchesModule } from './branches/branches.module';
import { AboutModule } from './about/about.module';
import { SettingsModule } from './settings/settings.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017/bilim-nuru',
      }),
    }),
    AuthModule,
    CoursesModule,
    BlogsModule,
    TeachersModule,
    ReviewsModule,
    ContactsModule,
    BranchesModule,
    AboutModule,
    SettingsModule,
    UploadsModule,
  ],
})
export class AppModule {}
