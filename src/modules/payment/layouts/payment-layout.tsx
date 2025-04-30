interface PaymentLayoutProps {
  children: React.ReactNode;
}

export const PaymentLayout = ({ children }: PaymentLayoutProps) => {
  return <div className="container max-w-screen-md mx-auto">{children}</div>;
};
