import { BlockData } from '../core/tenant/tenant.model';

/**
 * Interface that every Block component must implement.
 * Ensures ngComponentOutlet can bind the `data` input uniformly.
 */
export interface BlockBase<T extends BlockData = BlockData> {
  data: T;
}
