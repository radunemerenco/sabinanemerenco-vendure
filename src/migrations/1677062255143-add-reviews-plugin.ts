import {MigrationInterface, QueryRunner} from "typeorm";

export class addReviewsPlugin1677062255143 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "product_review" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "summary" character varying NOT NULL, "body" text NOT NULL, "rating" integer NOT NULL, "authorName" character varying NOT NULL, "authorLocation" character varying, "upvotes" integer NOT NULL DEFAULT '0', "downvotes" integer NOT NULL DEFAULT '0', "state" character varying NOT NULL, "response" text, "responseCreatedAt" TIMESTAMP, "id" SERIAL NOT NULL, "productId" integer, "productVariantId" integer, "authorId" integer, CONSTRAINT "PK_6c00bd3bbee662e1f7a97dbce9a" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "featuredReviewId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsReviewrating" double precision`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsReviewcount" double precision DEFAULT '0'`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_79742b8b96d2fe76e274de1d69d" FOREIGN KEY ("featuredReviewId") REFERENCES "product_review"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "product_review" ADD CONSTRAINT "FK_06e7335708b5e7870f1eaa608d2" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "product_review" ADD CONSTRAINT "FK_de987f9289b240e8702c9b8148e" FOREIGN KEY ("productVariantId") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "product_review" ADD CONSTRAINT "FK_15a352d289533a11d67715d353a" FOREIGN KEY ("authorId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product_review" DROP CONSTRAINT "FK_15a352d289533a11d67715d353a"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_review" DROP CONSTRAINT "FK_de987f9289b240e8702c9b8148e"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_review" DROP CONSTRAINT "FK_06e7335708b5e7870f1eaa608d2"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_79742b8b96d2fe76e274de1d69d"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsReviewcount"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsReviewrating"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "featuredReviewId"`, undefined);
        await queryRunner.query(`DROP TABLE "product_review"`, undefined);
   }

}
