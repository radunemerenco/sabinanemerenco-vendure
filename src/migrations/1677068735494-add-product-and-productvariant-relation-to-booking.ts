import {MigrationInterface, QueryRunner} from "typeorm";

export class addProductAndProductvariantRelationToBooking1677068735494 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "booking_entity" ADD "productId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "booking_entity" ADD "productVariantId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "booking_entity" ADD CONSTRAINT "FK_2621281863f5af2a92c29dd8041" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "booking_entity" ADD CONSTRAINT "FK_3c814b513a4e6225db1fdcdffab" FOREIGN KEY ("productVariantId") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "booking_entity" DROP CONSTRAINT "FK_3c814b513a4e6225db1fdcdffab"`, undefined);
        await queryRunner.query(`ALTER TABLE "booking_entity" DROP CONSTRAINT "FK_2621281863f5af2a92c29dd8041"`, undefined);
        await queryRunner.query(`ALTER TABLE "booking_entity" DROP COLUMN "productVariantId"`, undefined);
        await queryRunner.query(`ALTER TABLE "booking_entity" DROP COLUMN "productId"`, undefined);
   }

}
