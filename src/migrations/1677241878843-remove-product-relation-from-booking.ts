import {MigrationInterface, QueryRunner} from "typeorm";

export class removeProductRelationFromBooking1677241878843 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "booking_entity" DROP CONSTRAINT "FK_2621281863f5af2a92c29dd8041"`, undefined);
        await queryRunner.query(`ALTER TABLE "booking_entity" DROP COLUMN "productId"`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "booking_entity" ADD "productId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "booking_entity" ADD CONSTRAINT "FK_2621281863f5af2a92c29dd8041" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

}
