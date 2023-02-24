import {MigrationInterface, QueryRunner} from "typeorm";

export class createBookingsPlugin1677001912623 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "booking_entity" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "seatsAvailable" integer NOT NULL, "id" SERIAL NOT NULL, CONSTRAINT "PK_ab285d4d9e829aa0fc5f679c7e2" PRIMARY KEY ("id"))`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "booking_entity"`, undefined);
   }

}
