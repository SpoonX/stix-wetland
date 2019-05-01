import { AbstractCommand, inject, Output } from 'stix';
import { WetlandService } from '../Service';
import { getName } from '../../utils';

export class SnapshotCommand extends AbstractCommand {
  @inject(WetlandService)
  private wetlandService: WetlandService;

  public async create (output: Output, { name }: { name?: string }) {
    const snapshotName = await getName(name);

    await this.wetlandService.getInstance().getSnapshotManager().create(snapshotName as string, false);

    output.success(`Snapshot ${snapshotName} created.`);
  }

  public async remove (output: Output, { name }: { name?: string }) {
    const snapshotName = await getName(name);

    await this.wetlandService.getInstance().getSnapshotManager().remove(snapshotName as string, false);

    output.success(`Snapshot ${snapshotName} removed.`);
  }
}
