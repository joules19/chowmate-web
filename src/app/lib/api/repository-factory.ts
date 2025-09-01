import { DashboardRepository } from "./repositories/dashboard-repository";
import { VendorRepository } from "./repositories/vendor-repository";
import { OrderRepository } from "./repositories/order-repository";
import { RiderRepository } from "./repositories/rider-repository";
// import { UserRepository } from "./repositories/user-repository";

// Define repository types (uncomment and import as needed)
type UserRepository = unknown; // Replace with actual type when available

export class RepositoryFactory {
  private static vendors: VendorRepository | null = null;
  private static orders: OrderRepository | null = null;
  private static riders: RiderRepository | null = null;
  private static users: UserRepository | null = null;
  private static dashboardRepo: DashboardRepository | null = null;

  static getDashboardRepository(): DashboardRepository {
    if (!this.dashboardRepo) {
      this.dashboardRepo = new DashboardRepository();
    }
    return this.dashboardRepo;
  }

  static getVendorRepository(): VendorRepository {
    if (!this.vendors) {
      this.vendors = new VendorRepository();
    }
    return this.vendors;
  }

  static getOrderRepository(): OrderRepository {
    if (!this.orders) {
      this.orders = new OrderRepository();
    }
    return this.orders;
  }

  static getRiderRepository(): RiderRepository {
    if (!this.riders) {
      this.riders = new RiderRepository();
    }
    return this.riders;
  }

  static getUserRepository(): UserRepository {
    if (!this.users) {
      // this.users = new UserRepository(); // Uncomment when UserRepository is available
      throw new Error('UserRepository not implemented');
    }
    return this.users;
  }

  static clearCache(): void {
    this.vendors = null;
    this.orders = null;
    this.riders = null;
    this.users = null;
    this.dashboardRepo = null;
  }

  // Convenient static getters
  static get vendor() {
    return this.getVendorRepository();
  }

  static get order() {
    return this.getOrderRepository();
  }

  static get rider() {
    return this.getRiderRepository();
  }

  static get dashboard() {
    return this.getDashboardRepository();
  }
}