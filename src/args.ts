import { CliOptions } from "./types";
import { RED, RESET } from "./utils/colors";
import pkg from "../package.json";

export function parseCliArgs(argv: readonly string[]): CliOptions | null {
    let target: string = ".";
    let showInfo: boolean = false;
    let help: boolean = false;
    let version: boolean = false;

    for (const arg of argv) {
        if (arg === "-i" || arg === "--info") {
            showInfo = true
        } else if (arg === "-h" || arg === "--help") {
            help = true;
        } else if (arg === "-v" || arg === "--version") {
            version = true;
        } else if (arg.startsWith("-")) {
            console.error(`${RED}Error:${RESET} Unknown option: ${arg}`);
            return null;
        } else {
            target = arg;
        }
    }

    return { target, showInfo, help, version };
}

export function handleMetaFlags(options: CliOptions): boolean {
    if (options.help) {
        console.log(
            "Usage: epiclint [options] [path]\n\nOptions:\n" +
            "   -i, --info      Show info alerts\n" +
            "   -h, --help      Show help\n" +
            "   -v, --version   Show version"
        );
        return true;
    }

    if (options.version) {
        console.log(`epiclint v${pkg.version}`);
        return true;
    }

    return false;
}