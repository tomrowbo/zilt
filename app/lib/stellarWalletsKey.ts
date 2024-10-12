import {
    StellarWalletsKit,
    WalletNetwork,
    allowAllModules,
    XBULL_ID,
    FREIGHTER_ID,
    ISupportedWallet,
  } from '@creit.tech/stellar-wallets-kit';
  
  // Initialize the kit with testnet configuration
  export const kit: StellarWalletsKit = new StellarWalletsKit({
    network: WalletNetwork.TESTNET,
    selectedWalletId: FREIGHTER_ID,    
    modules: allowAllModules(),    
  });
  
  // Opens the modal for wallet selection and handles connection
  export const openWalletModal = async (): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      kit.openModal({
        onWalletSelected: async (option: ISupportedWallet) => {
          try {
            kit.setWallet(option.id);
            const { address } = await kit.getAddress();
            resolve(address);
            console.log("Wallet address:", address);
            window.location.href = '/';
          } catch (error) {
            console.error("Failed to retrieve wallet address:", error);
            reject(null);
          }
        },
        onClosed: () => {
          console.log("Wallet selection was canceled.");
          reject(null);
        }
      });
    });
  };