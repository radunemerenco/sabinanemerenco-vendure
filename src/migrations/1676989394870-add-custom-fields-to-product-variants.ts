import {MigrationInterface, QueryRunner} from "typeorm";

export class addCustomFieldsToProductVariants1676989394870 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "customFieldsStartdate" TIMESTAMP(6)`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "customFieldsEnddate" TIMESTAMP(6)`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "customFieldsSeatsavailable" integer`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "customFieldsSeatsavailable"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "customFieldsEnddate"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "customFieldsStartdate"`, undefined);
   }

}
