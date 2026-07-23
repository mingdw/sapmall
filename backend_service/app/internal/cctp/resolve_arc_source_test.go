package cctp

import "testing"

func TestResolveArcSourceLinea(t *testing.T) {
	m, ok := ResolveArcSource(59141)
	if !ok {
		t.Fatal("Linea Sepolia (59141) should be a supported Arc CCTP source")
	}
	if m.Domain != LineaSepoliaDomain {
		t.Fatalf("domain want %d got %d", LineaSepoliaDomain, m.Domain)
	}
	if m.USDC != LineaSepoliaUSDC {
		t.Fatalf("usdc mismatch: %s", m.USDC)
	}
}

func TestResolveArcSourceBase(t *testing.T) {
	m, ok := ResolveArcSource(84532)
	if !ok {
		t.Fatal("Base Sepolia should be supported")
	}
	if m.Domain != BaseSepoliaDomain {
		t.Fatalf("domain want %d got %d", BaseSepoliaDomain, m.Domain)
	}
}
