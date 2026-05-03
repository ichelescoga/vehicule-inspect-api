-- ============================================================
-- MIGRATION 001: Multi-tenancy - Crear tabla Company y agregar
-- company_id a tablas maestras
-- Vehicle Inspect - Korea Autos GT
-- Fecha: 2026-05-03
-- ============================================================

-- ============================================================
-- PASO 1: Crear tabla Company
-- ============================================================
CREATE TABLE IF NOT EXISTS `Company` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `logo` VARCHAR(500) NULL,
  `config` JSON NULL,
  `create_date` DATE NULL,
  `update_date` DATE NULL,
  `status` INT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- PASO 2: Insertar Korea Autos como empresa inicial
-- ============================================================
INSERT INTO `Company` (`id`, `name`, `logo`, `config`, `create_date`, `status`)
VALUES (1, 'Korea Autos GT', NULL, NULL, CURDATE(), 1);

-- ============================================================
-- PASO 3: Agregar company_id a las 10 tablas maestras
-- ============================================================

-- 3.1 Client
ALTER TABLE `Client`
  ADD COLUMN `company_id` INT NULL AFTER `id`,
  ADD INDEX `fk_client_company_idx` (`company_id`),
  ADD CONSTRAINT `fk_client_company`
    FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- 3.2 Vehicle
ALTER TABLE `Vehicle`
  ADD COLUMN `company_id` INT NULL AFTER `id`,
  ADD INDEX `fk_vehicle_company_idx` (`company_id`),
  ADD CONSTRAINT `fk_vehicle_company`
    FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- 3.3 Technical
ALTER TABLE `Technical`
  ADD COLUMN `company_id` INT NULL AFTER `id`,
  ADD INDEX `fk_technical_company_idx` (`company_id`),
  ADD CONSTRAINT `fk_technical_company`
    FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- 3.4 Vendor
ALTER TABLE `Vendor`
  ADD COLUMN `company_id` INT NULL AFTER `id`,
  ADD INDEX `fk_vendor_company_idx` (`company_id`),
  ADD CONSTRAINT `fk_vendor_company`
    FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- 3.5 Order_Header
ALTER TABLE `Order_Header`
  ADD COLUMN `company_id` INT NULL AFTER `id`,
  ADD INDEX `fk_order_company_idx` (`company_id`),
  ADD CONSTRAINT `fk_order_company`
    FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- 3.6 User
ALTER TABLE `User`
  ADD COLUMN `company_id` INT NULL AFTER `id`,
  ADD INDEX `fk_user_company_idx` (`company_id`),
  ADD CONSTRAINT `fk_user_company`
    FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- 3.7 Service_Type
ALTER TABLE `Service_Type`
  ADD COLUMN `company_id` INT NULL AFTER `id`,
  ADD INDEX `fk_service_type_company_idx` (`company_id`),
  ADD CONSTRAINT `fk_service_type_company`
    FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- 3.8 Service
ALTER TABLE `Service`
  ADD COLUMN `company_id` INT NULL AFTER `id`,
  ADD INDEX `fk_service_company_idx` (`company_id`),
  ADD CONSTRAINT `fk_service_company`
    FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- 3.9 Service_Option
ALTER TABLE `Service_Option`
  ADD COLUMN `company_id` INT NULL AFTER `id`,
  ADD INDEX `fk_service_option_company_idx` (`company_id`),
  ADD CONSTRAINT `fk_service_option_company`
    FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- 3.10 Vehicle_Part
ALTER TABLE `Vehicle_Part`
  ADD COLUMN `company_id` INT NULL AFTER `id`,
  ADD INDEX `fk_vehicle_part_company_idx` (`company_id`),
  ADD CONSTRAINT `fk_vehicle_part_company`
    FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- ============================================================
-- PASO 4: Asignar todos los registros existentes a Korea Autos
-- ============================================================
UPDATE `Client` SET `company_id` = 1 WHERE `company_id` IS NULL;
UPDATE `Vehicle` SET `company_id` = 1 WHERE `company_id` IS NULL;
UPDATE `Technical` SET `company_id` = 1 WHERE `company_id` IS NULL;
UPDATE `Vendor` SET `company_id` = 1 WHERE `company_id` IS NULL;
UPDATE `Order_Header` SET `company_id` = 1 WHERE `company_id` IS NULL;
UPDATE `User` SET `company_id` = 1 WHERE `company_id` IS NULL;
UPDATE `Service_Type` SET `company_id` = 1 WHERE `company_id` IS NULL;
UPDATE `Service` SET `company_id` = 1 WHERE `company_id` IS NULL;
UPDATE `Service_Option` SET `company_id` = 1 WHERE `company_id` IS NULL;
UPDATE `Vehicle_Part` SET `company_id` = 1 WHERE `company_id` IS NULL;

-- ============================================================
-- PASO 5: Hacer company_id NOT NULL despues de llenar datos
-- ============================================================
ALTER TABLE `Client` MODIFY COLUMN `company_id` INT NOT NULL;
ALTER TABLE `Vehicle` MODIFY COLUMN `company_id` INT NOT NULL;
ALTER TABLE `Technical` MODIFY COLUMN `company_id` INT NOT NULL;
ALTER TABLE `Vendor` MODIFY COLUMN `company_id` INT NOT NULL;
ALTER TABLE `Order_Header` MODIFY COLUMN `company_id` INT NOT NULL;
ALTER TABLE `User` MODIFY COLUMN `company_id` INT NOT NULL;
ALTER TABLE `Service_Type` MODIFY COLUMN `company_id` INT NOT NULL;
ALTER TABLE `Service` MODIFY COLUMN `company_id` INT NOT NULL;
ALTER TABLE `Service_Option` MODIFY COLUMN `company_id` INT NOT NULL;
ALTER TABLE `Vehicle_Part` MODIFY COLUMN `company_id` INT NOT NULL;
