import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../api/client', () => ({
  get: vi.fn(),
  post: vi.fn()
}));

import api from '../api/client';
import MarketplaceCompare from '../components/MarketplaceCompare';

const queryClient = new QueryClient();

describe('MarketplaceCompare', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders results after search and calls ingest', async () => {
    (api.get as any).mockResolvedValueOnce({ data: { results: [
      { externalId: 'r1', name: 'Mock A', price: 100, vendor: 'amazon', vendorName: 'Amazon', availability: true, distance: 1.2 },
      { externalId: 'r2', name: 'Mock B', price: 90, vendor: 'flipkart', vendorName: 'Flipkart', availability: true, distance: 0.8 }
    ] } });

    (api.post as any).mockResolvedValueOnce({ data: { success: true } });

    render(
      <QueryClientProvider client={queryClient}>
        <MarketplaceCompare userLocation={{ lat: 10, lng: 78 }} />
      </QueryClientProvider>
    );

    const input = screen.getByLabelText(/Barcode or SKU/i);
    fireEvent.change(input, { target: { value: '12345' } });

    const searchBtn = screen.getByRole('button', { name: /Search marketplaces/i });
    fireEvent.click(searchBtn);

    await waitFor(() => expect(api.get).toHaveBeenCalled());

    expect(await screen.findByText('Amazon')).toBeInTheDocument();
    expect(await screen.findByText('Flipkart')).toBeInTheDocument();

    const ingestBtn = screen.getByRole('button', { name: /Ingest and persist results/i });
    fireEvent.click(ingestBtn);

    await waitFor(() => expect(api.post).toHaveBeenCalled());
  });
});
