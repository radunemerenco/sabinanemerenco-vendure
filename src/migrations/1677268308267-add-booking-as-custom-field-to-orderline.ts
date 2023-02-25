import {MigrationInterface, QueryRunner} from "typeorm";

export class addBookingAsCustomFieldToOrderline1677268308267 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order_line" ADD "bookingId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "order_line" ADD "customFields__fix_relational_custom_fields__" boolean`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "order_line"."customFields__fix_relational_custom_fields__" IS 'A work-around needed when only relational custom fields are defined on an entity'`, undefined);
        await queryRunner.query(`ALTER TABLE "order_line" ADD CONSTRAINT "FK_034423767da4dce1ef8dc421e68" FOREIGN KEY ("bookingId") REFERENCES "booking_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order_line" DROP CONSTRAINT "FK_034423767da4dce1ef8dc421e68"`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "order_line"."customFields__fix_relational_custom_fields__" IS 'A work-around needed when only relational custom fields are defined on an entity'`, undefined);
        await queryRunner.query(`ALTER TABLE "order_line" DROP COLUMN "customFields__fix_relational_custom_fields__"`, undefined);
        await queryRunner.query(`ALTER TABLE "order_line" DROP COLUMN "bookingId"`, undefined);
   }

}
