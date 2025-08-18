import { VendorRepository } from "./repositories/vendor-repository";
import { OrderRepository } from "./repositories/order-repository";
import { RiderRepository } from "./repositories/rider-repository";
import { UserRepository } from "./repositories/user-repository";
import { DashboardRepository } from "./repositories/dashboard-repository";

export class RepositoryFactory {
  private static vendors: VendorRepository;
  private static orders: OrderRepository;
  private static riders: RiderRepository;
  private static users: UserRepository;

  private static dashboardRepo?: DashboardRepository;

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
      this.users = new UserRepository();
    }
    return this.users;
  }

  static clearCache(): void {
    this.vendors = null as any;
    this.orders = null as any;
    this.riders = null as any;
    this.users = null as any;
  }
}