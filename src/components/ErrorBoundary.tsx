import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[UNCAUGHT APPLICATION ERROR]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private toggleDetails = () => {
    this.setState(prevState => ({ showDetails: !prevState.showDetails }));
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-50 font-sans">
          <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8 text-center relative overflow-hidden">
            {/* Decorative background aura */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Error Icon badge */}
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-6 shadow-inner">
              <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
            </div>

            {/* Main message */}
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 tracking-tight">
              Kutilmagan xatolik yuz berdi
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed">
              Dasturda kutilmagan texnik to'xtalish aniqlandi. Xavotir olmang, sizning barcha ma'lumotlaringiz va o'quv natijalaringiz xavfsiz saqlanmoqda.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all transform active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Sahifani qayta yuklash
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all transform active:scale-95 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Bosh sahifaga qaytish
              </button>
            </div>

            {/* Diagnostics & Technical Details toggle */}
            <div className="border-t border-slate-100 pt-4 text-left">
              <button
                onClick={this.toggleDetails}
                className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-700 font-medium py-1 cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Xatolik haqida texnik tafsilotlar
                </span>
                {this.state.showDetails ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {this.state.showDetails && (
                <div className="mt-3 p-3.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto max-h-48 scrollbar-thin scrollbar-thumb-slate-700">
                  <p className="text-rose-400 font-bold mb-1">
                    {this.state.error?.toString() || 'Unknown runtime exception'}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="text-[11px] text-slate-400 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
