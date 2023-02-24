import {MigrationInterface, QueryRunner} from "typeorm";

export class removeCustomFieldsFromProductVariants1676990901446 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "customFieldsSeatsavailable"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "customFieldsStartdate"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "customFieldsEnddate"`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "customFieldsEnddate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "customFieldsStartdate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "customFieldsSeatsavailable" integer`, undefined);
   }

}
