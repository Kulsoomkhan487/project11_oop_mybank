import { faker } from "@faker-js/faker";
import inquirer from "inquirer";
import chalk from "chalk";

console.log(chalk.bold.cyanBright("\n\t Welcome to Our  Bank Management System \n"));

// Customer Class
class Customer {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  mobNumber: string;
  accNumber: number;

  constructor(fName: string, lName: string, age: number, gender: string, mob: string, acc: number) {
    this.firstName = fName;
    this.lastName = lName;
    this.age = age;
    this.gender = gender;
    this.mobNumber = mob;
    this.accNumber = acc;
  }
}

// Interface BankAccount
interface BankAccount {
  accNumber: number;
  balance: number;
}

// Class Bank
class Bank {
  customers: Customer[] = [];
  accounts: BankAccount[] = [];

  addCustomer(obj: Customer) {
    this.customers.push(obj);
  }

  addAccountNumber(obj: BankAccount) {
    this.accounts.push(obj);
  }

  findCustomerByAccNumber(accNumber: number): Customer | undefined {
    return this.customers.find(customer => customer.accNumber === accNumber);
  }
}

let myBank = new Bank();

// Customer Create
for (let index = 1; index <= 5; index++) {
  let fName = faker.person.firstName("male");
  let lName = faker.person.lastName();
  let age = faker.number.int({ min: 18, max: 65 }); // Correct way to get a random age
  let mob = faker.string.numeric(10); // Correct way to get a random mobile number

  const cus = new Customer(fName, lName, age, "male", mob, 224455689 + index);
  myBank.addCustomer(cus);
  myBank.addAccountNumber({
    accNumber: cus.accNumber,
    balance: 980 * index,
  });
}

// Bank Functionality

async function bankService(bank: Bank) {
  let exit = false;

  while (!exit) {
    let service = await inquirer.prompt({
      name: "Select",
      type: "list",
      message: "Please Select the Services",
      choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"],
    });

    switch (service.Select) {
      case "View Balance":
        let resBalance = await inquirer.prompt({
          name: "accountNumber",
          type: "input",
          message: "Please Enter Your Account Number",
        });

        let accountBalance = myBank.accounts.find(
          (acc) => acc.accNumber == parseInt(resBalance.accountNumber)
        );
        if (!accountBalance) {
          console.log(chalk.bold.red("Invalid Account Number"));
        } else {
          let customerBalance = myBank.findCustomerByAccNumber(accountBalance.accNumber);
          let fullNameBalance = customerBalance ? `${customerBalance.firstName} ${customerBalance.lastName}` : "Unknown";
          console.log(chalk.bold.green(`Dear ${fullNameBalance}, Your balance is ${accountBalance.balance}`));
        }
        break;

      case "Cash Withdraw":
        let resWithdraw = await inquirer.prompt([
          {
            name: "accountNumber",
            type: "input",
            message: "Please Enter Your Account Number",
          },
          {
            name: "amount",
            type: "input",
            message: "Please Enter Amount to Withdraw",
          },
        ]);

        let accountWithdraw = myBank.accounts.find(
          (acc) => acc.accNumber == parseInt(resWithdraw.accountNumber)
        );
        if (!accountWithdraw) {
          console.log(chalk.bold.red("Invalid Account Number"));
        } else {
          let amountWithdraw = parseInt(resWithdraw.amount);
          if (accountWithdraw.balance < amountWithdraw) {
            console.log(chalk.bold.red("Insufficient Balance"));
          } else {
            accountWithdraw.balance -= amountWithdraw;
            let customerWithdraw = myBank.findCustomerByAccNumber(accountWithdraw.accNumber);
            let fullNameWithdraw = customerWithdraw ? `${customerWithdraw.firstName} ${customerWithdraw.lastName}` : "Unknown";
            console.log(chalk.bold.green(`Dear ${fullNameWithdraw}, Withdrawn $${amountWithdraw}. New balance is ${accountWithdraw.balance}`));
          }
        }
        break;

      case "Cash Deposit":
        let resDeposit = await inquirer.prompt([
          {
            name: "accountNumber",
            type: "input",
            message: "Please Enter Your Account Number",
          },
          {
            name: "amount",
            type: "input",
            message: "Please Enter Amount to Deposit",
          },
        ]);

        let accountDeposit = myBank.accounts.find(
          (acc) => acc.accNumber == parseInt(resDeposit.accountNumber)
        );
        if (!accountDeposit) {
          console.log(chalk.bold.red.italic("Invalid Account Number"));
        } else {
          let amountDeposit = parseInt(resDeposit.amount);
          accountDeposit.balance += amountDeposit;
          let customerDeposit = myBank.findCustomerByAccNumber(accountDeposit.accNumber);
          let fullNameDeposit = customerDeposit ? `${customerDeposit.firstName} ${customerDeposit.lastName}` : "Unknown";
          console.log(chalk.bold.green.italic(`Dear ${fullNameDeposit}, Deposited ${amountDeposit}. New balance is ${accountDeposit.balance}`));
        }
        break;

      case "Exit":
        exit = true;
        console.log(chalk.bold.cyanBright("\n \t Thank you for using our services!\n"));
        break;
    }
  }
}

bankService(myBank);
//224455692
