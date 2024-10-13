import { ReactNode, useMemo } from 'react';
import { useNavigation } from '@remix-run/react';
import { Loader2 } from 'lucide-react';

const LoaderWrapper = ({ children }: { children: ReactNode }) => {
  const { state } = useNavigation();
  const isLoading = useMemo(() => state === 'loading', [state]);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-primary mt-2">Loading...</p>
          </div>
        </div>
      )}

      <div className={`${isLoading ? 'pointer-events-none' : ''}`}>
        {children}
      </div>
    </div>
  );
};
export default LoaderWrapper;
