import { TaxCodeModel } from "avatax/lib/models/TaxCodeModel";
import type { TaxCode } from "../../taxes/tax-code";
import { TaxBadProviderResponseError } from "../../taxes/tax-error";
import { taxProviderUtils } from "../../taxes/tax-provider-utils";
import { AvataxClient } from "../avatax-client";

export class AvataxTaxCodesService {
  constructor(private client: AvataxClient) {}

  private adapt(taxCodes: TaxCodeModel[]): TaxCode[] {
    return taxCodes.map((item) => ({
      description: taxProviderUtils.resolveOptionalOrThrowUnexpectedError(
        item.description,
        new TaxBadProviderResponseError("Cannot resolve tax code description"),
      ),
      code: item.taxCode,
    }));
  }

  async getAllFiltered({ filter }: { filter: string | null }): Promise<TaxCode[]> {
    const response = await this.client.getFilteredTaxCodes({ filter });

    return this.adapt(response);
  }
}
