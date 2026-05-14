ALTER TABLE profesional_info
    ADD COLUMN stripe_customer_id     VARCHAR(255) NULL,
    ADD COLUMN stripe_subscription_id VARCHAR(255) NULL;
