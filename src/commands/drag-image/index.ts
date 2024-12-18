import { CopyImage } from "~commands/drag-image/copy-image"
import { CopyUrl } from "~commands/drag-image/copy-url"
import { Download } from "~commands/drag-image/download"
import { Open } from "~commands/drag-image/open"

export default [new CopyUrl(), new CopyImage(), new Open(), new Download()]
