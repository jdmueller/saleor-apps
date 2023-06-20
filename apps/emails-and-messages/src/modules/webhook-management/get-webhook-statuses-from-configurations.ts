import { SendgridConfiguration } from "../sendgrid/configuration/sendgrid-config-schema";
import { SmtpConfiguration } from "../smtp/configuration/smtp-config-schema";
import { AppWebhook, eventToWebhookMapping } from "./webhook-management-service";

/*
 * Returns dictionary of webhook statuses based on passed configurations.
 * Webhook is marked as active (true) if at least one event related event is marked as active.
 */
export const getWebhookStatusesFromConfigurations = ({
  smtpConfigurations,
  sendgridConfigurations,
}: {
  smtpConfigurations: SmtpConfiguration[];
  sendgridConfigurations: SendgridConfiguration[];
}) => {
  const statuses: Record<AppWebhook, boolean> = {
    invoiceSentWebhook: false,
    notifyWebhook: false,
    orderCancelledWebhook: false,
    orderConfirmedWebhook: false,
    orderFulfilledWebhook: false,
    orderCreatedWebhook: false,
    orderFullyPaidWebhook: false,
  };

  smtpConfigurations.forEach(async (config) => {
    if (!config.active) {
      // Configuration has to be active to enable webhook
      return;
    }
    config.events.forEach(async (event) => {
      if (event.active) {
        /*
         * Mapping is mandatory since multiple events can be mapped to one webhook,
         * as in case of NOTIFY
         */
        statuses[eventToWebhookMapping[event.eventType]] = true;
      }
    });
  });

  sendgridConfigurations.forEach(async (config) => {
    if (!config.active) {
      return;
    }
    config.events.forEach(async (event) => {
      if (event.active) {
        statuses[eventToWebhookMapping[event.eventType]] = true;
      }
    });
  });

  return statuses;
};
