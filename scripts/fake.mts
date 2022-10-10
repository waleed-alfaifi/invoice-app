import { faker } from "@faker-js/faker";
import { writeFile } from "fs/promises";
import * as path from "path";

interface Links
  extends Array<{
    rel: "self" | "item";
    href: string;
    action: "GET" | "POST" | "PUT" | "DELETE";
  }> {}

interface Address {
  street: string;
  city: string;
  post_code: string;
  country: string;
}

interface InvoiceItem {
  id?: number;
  name: string;
  quantity: number;
  price: number;
}

type PaymentKey = "terms_1" | "terms_7" | "terms_14" | "terms_30";

interface InvoiceDetails {
  description: string;
  address: Address;
  items: InvoiceItem[];
  payment: {
    key: PaymentKey;
    text: string;
  };
  links?: Links;
}

interface Invoice extends Partial<InvoiceDetails> {
  id: string;
  client: {
    name: string;
    email?: string;
    address?: Address;
  };
  date: number;
  status: "Paid" | "Pending" | "Draft";
}

const statuses: readonly Invoice["status"][] = ["Draft", "Paid", "Pending"];
const termsMap: Record<PaymentKey, string> = {
  terms_1: "Net 1 Day",
  terms_7: "Net 7 Days",
  terms_14: "Net 14 Days",
  terms_30: "Net 30 Days",
};
const NUMBER_OF_INVOICES = 10;

const createRandomInvoices = () => {
  const invoices: Invoice[] = [];

  Array.from({ length: NUMBER_OF_INVOICES }).forEach((_, index) => {
    const invoice: Invoice = {
      id: faker.datatype.uuid(),
      description: (() => {
        const adjective = faker.word.adjective(5);
        const noun = faker.word.noun(5);
        const capFirst = (str: string) =>
          str.charAt(0).toUpperCase() + str.slice(1);

        return `${capFirst(adjective)} ${capFirst(noun)}`;
      })(),
      date: faker.date.soon(30).getTime(),
      status: faker.helpers.arrayElement(statuses),
      payment: (() => {
        const key = faker.helpers.objectKey(termsMap);

        return {
          key,
          text: termsMap[key],
        };
      })(),
      client: {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        address: {
          city: faker.address.city(),
          country: faker.address.country(),
          post_code: faker.address.zipCode(),
          street: faker.address.street(),
        },
      },
      address: {
        city: faker.address.city(),
        country: faker.address.country(),
        post_code: faker.address.zipCode(),
        street: faker.address.street(),
      },
      items: Array.from({ length: Math.ceil(Math.random() * index + 1) }).map(
        () => ({
          price: Number.parseFloat(faker.finance.amount(0, 1000)),
          name: (() => {
            const adjective = faker.word.adjective(5);
            const noun = faker.word.noun(5);
            const capFirst = (str: string) =>
              str.charAt(0).toUpperCase() + str.slice(1);

            return `${capFirst(adjective)} ${capFirst(noun)}`;
          })(),
          quantity: Number.parseInt(faker.finance.amount(0, 100, 0)),
        })
      ),
    };

    invoices.push(invoice);
  });

  return invoices;
};

const generateFile = async (data: unknown) => {
  const filePath = "./scripts/";
  const fileName = "data.json";
  const joinedPath = path.join(filePath, fileName);
  await writeFile(joinedPath, JSON.stringify(data));

  console.log(`successfully written data to ${joinedPath}.`);
};

generateFile(createRandomInvoices());
