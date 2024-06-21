import CurveRouterV13Abi from "./abis/curverouterv13.abi.json";
import HiroRouterV01 from "./abis/HiroRouterV0.1.abi.json";
import HiroRouterV02 from "./abis/HiroRouterV0.2.abi.json";
import HiroRouterV03 from "./abis/HiroRouterV0.3.abi.json";

export const HIRO_ROUTER_ABIS: { [key: string]: any} = {
  "0.1": HiroRouterV01,
  "0.2": HiroRouterV02,
  "0.3": HiroRouterV03,
  "test": HiroRouterV03
}
export const CURVE_ROUTER_ABI = CurveRouterV13Abi;
