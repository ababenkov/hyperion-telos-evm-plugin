"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var hyperion_plugin_1 = require("../../hyperion-plugin");
var node_fetch_1 = __importDefault(require("node-fetch"));
var fastify_autoload_1 = __importDefault(require("fastify-autoload"));
var path_1 = require("path");
var tx_1 = require("@ethereumjs/tx");
var common_1 = __importDefault(require("@ethereumjs/common"));
var BN = require('bn.js');
var createKeccakHash = require('keccak');
var TelosEvmApi = require('@telosnetwork/telosevm-js').TelosEvmApi;
var TelosEvm = /** @class */ (function (_super) {
    __extends(TelosEvm, _super);
    function TelosEvm(config) {
        var _a;
        var _this = _super.call(this) || this;
        _this.hasApiRoutes = true;
        _this.actionHandlers = [];
        _this.deltaHandlers = [];
        _this.decimalsBN = new BN('1000000000000000000');
        _this.baseChain = 'mainnet';
        _this.hardfork = 'istanbul';
        _this.counter = 0;
        if (config) {
            _this.pluginConfig = config;
            if ((_a = config.contracts) === null || _a === void 0 ? void 0 : _a.main) {
                _this.dynamicContracts.push(config.contracts.main);
            }
            if (config.chainId) {
                _this.common = common_1.default.forCustomChain(_this.baseChain, { chainId: config.chainId }, _this.hardfork);
                _this.loadActionHandlers();
                _this.loadDeltaHandlers();
            }
        }
        return _this;
    }
    TelosEvm.prototype.loadDeltaHandlers = function () {
        var _this = this;
        // eosio.evm::receipt
        this.deltaHandlers.push({
            table: 'receipt',
            contract: 'eosio.evm',
            mappings: {
                delta: {
                    "@evmReceipt": {
                        "properties": {
                            "index": { "type": "long" },
                            "hash": { "type": "keyword" },
                            "trx_index": { "type": "long" },
                            "block": { "type": "long" },
                            "block_hash": { "type": "keyword" },
                            "trxid": { "type": "keyword" },
                            "status": { "type": "byte" },
                            "epoch": { "type": "long" },
                            "createdaddr": { "type": "keyword" },
                            "gasused": { "type": "long" },
                            "ramused": { "type": "long" },
                            "logs": {
                                "properties": {
                                    "address": { "type": "keyword" },
                                    "data": { "enabled": false },
                                    "topics": { "type": "keyword" }
                                }
                            },
                            "output": { "enabled": false },
                            "errors": { "enabled": false },
                        }
                    }
                }
            },
            handler: function (delta) { return __awaiter(_this, void 0, void 0, function () {
                var data, blockHex, blockHash;
                return __generator(this, function (_a) {
                    data = delta.data;
                    blockHex = data.block.toString(16);
                    blockHash = createKeccakHash('keccak256').update(blockHex).digest('hex');
                    delta['@evmReceipt'] = {
                        index: data.index,
                        hash: data.hash.toLowerCase(),
                        trx_index: data.trx_index,
                        block: data.block,
                        block_hash: blockHash,
                        trxid: data.trxid.toLowerCase(),
                        status: data.status,
                        epoch: data.epoch,
                        createdaddr: data.createdaddr.toLowerCase(),
                        gasused: parseInt('0x' + data.gasused),
                        ramused: parseInt('0x' + data.ramused),
                        output: data.output
                    };
                    console.log(data.trx_index);
                    if (data.logs) {
                        delta['@evmReceipt']['logs'] = JSON.parse(data.logs);
                        if (delta['@evmReceipt']['logs'].length === 0) {
                            delete delta['@evmReceipt']['logs'];
                        }
                        else {
                            console.log('------- LOGS -----------');
                            console.log(delta['@evmReceipt']['logs']);
                        }
                    }
                    if (data.errors) {
                        delta['@evmReceipt']['errors'] = JSON.parse(data.errors);
                        if (delta['@evmReceipt']['errors'].length === 0) {
                            delete delta['@evmReceipt']['errors'];
                        }
                        else {
                            console.log('------- ERRORS -----------');
                            console.log(delta['@evmReceipt']['errors']);
                        }
                    }
                    delete delta.data;
                    return [2 /*return*/];
                });
            }); }
        });
    };
    TelosEvm.prototype.loadActionHandlers = function () {
        var _this = this;
        // eosio.evm::raw
        this.actionHandlers.push({
            action: 'raw',
            contract: 'eosio.evm',
            mappings: {
                action: {
                    "@raw": {
                        "properties": {
                            "from": { "type": "keyword" },
                            "to": { "type": "keyword" },
                            "ram_payer": { "type": "keyword" },
                            "hash": { "type": "keyword" },
                            "value": { "type": "keyword" },
                            "value_d": { "type": "double" },
                            "nonce": { "type": "long" },
                            "gas_price": { "type": "double" },
                            "gas_limit": { "type": "double" },
                            "input_data": { "enabled": false }
                        }
                    }
                }
            },
            handler: function (action) {
                var _a, _b, _c, _d, _e, _f, _g;
                // attach action extras here
                var data = action['act']['data'];
                _this.counter++;
                // decode internal EVM tx
                if (data.tx) {
                    try {
                        var tx = tx_1.Transaction.fromSerializedTx(Buffer.from(data.tx, 'hex'), {
                            common: _this.common,
                        });
                        var txBody = {
                            hash: '0x' + ((_a = tx.hash()) === null || _a === void 0 ? void 0 : _a.toString('hex')),
                            to: (_b = tx.to) === null || _b === void 0 ? void 0 : _b.toString(),
                            value: (_c = tx.value) === null || _c === void 0 ? void 0 : _c.toString(),
                            nonce: (_d = tx.nonce) === null || _d === void 0 ? void 0 : _d.toString(),
                            gas_price: (_e = tx.gasPrice) === null || _e === void 0 ? void 0 : _e.toString(),
                            gas_limit: (_f = tx.gasLimit) === null || _f === void 0 ? void 0 : _f.toString(),
                            input_data: '0x' + ((_g = tx.data) === null || _g === void 0 ? void 0 : _g.toString('hex')),
                        };
                        if (data.sender) {
                            txBody["from"] = '0x' + data.sender.toLowerCase();
                        }
                        if (tx.to) {
                            txBody["to"] = tx.to.toString();
                        }
                        if (data.ram_payer) {
                            txBody["ram_payer"] = data.ram_payer;
                        }
                        if (txBody.value) {
                            // @ts-ignore
                            txBody['value_d'] = tx.value / _this.decimalsBN;
                        }
                        console.log(txBody);
                        action['@raw'] = txBody;
                        delete action['act']['data'];
                    }
                    catch (e) {
                        console.log(e);
                        console.log(data);
                    }
                }
            }
        });
    };
    TelosEvm.prototype.addRoutes = function (server) {
        server.decorate('evm', new TelosEvmApi({
            endpoint: server.chain_api,
            chainId: this.pluginConfig.chainId,
            ethPrivateKeys: [],
            fetch: node_fetch_1.default,
            telosContract: this.pluginConfig.contracts.main,
            telosPrivateKeys: []
        }));
        server.register(fastify_autoload_1.default, {
            dir: path_1.join(__dirname, 'routes'),
            options: this.pluginConfig
        });
    };
    return TelosEvm;
}(hyperion_plugin_1.HyperionPlugin));
exports.default = TelosEvm;
//# sourceMappingURL=index.js.map