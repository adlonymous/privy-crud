'use client';

import {PrivyProvider} from '@privy-io/react-auth';

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        embeddedWallets: {
          solana: {
            createOnLogin: 'all-users'
          }
        },
        solanaClusters: [{name: 'devnet', rpcUrl: 'https://devnet.helius-rpc.com/?api-key=0d1efb96-f508-493e-a545-870046d02c68'}],
        appearance: {
            theme: 'dark',
            // loginMethods: ['email', 'farcaster']
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}